using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using Sharp.Models;

namespace Sharp.Ado
{
    public class DepartmentSales
    {
        public List<DepartmentDto> GetDepartmentSales(StoreDto m)
        {
            string connectionString="Data Source="+m.PublicIp+"\\SPOSSQL_10,"+m.Port.ToString();
            connectionString +="; Initial Catalog="+m.DataBase+"; User Id=vbr; Password=mg812yn";

            string StartDate=m.StartDate;
            string EndDate=m.EndDate;
            if((string.IsNullOrEmpty(StartDate.Trim()))||(string.IsNullOrEmpty(EndDate.Trim())))
            {
                StartDate=DateTime.Now.ToString("yyyy-MM-dd");
                EndDate=DateTime.Now.AddDays(1).ToString("yyyy-MM-dd");
            }
            List<DepartmentDto> lm=new List<DepartmentDto>();
            #region SQL
            string Sql="declare @Depart Table ";
            Sql+="(dptno int,Amount money) ";
            Sql+="insert into @Depart ";
            Sql+="select dptno,sum(qty0*Price) from dbo.TranItems ";
            Sql+="where TrnNo in( ";
            Sql+="select TrnNo from TranHeaders ";
            Sql+="where DateTimeEnd between @SD  and @ED) and voidd =0 ";
            Sql+="group by dptno ";
            Sql+="select T.dptno,D.Name,T.Amount from @Depart T left join Depts D ";
            Sql+="on T.dptno=D.DptNo ";
            #endregion SQL
            #region Execute SQL
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();
                using (SqlCommand command = new SqlCommand(Sql, connection))
                {
                    #region Param
                    #region @SD
                    SqlParameter param  = new SqlParameter();
                    param.ParameterName="@SD";
                    param.Value=StartDate;
                    param.DbType=DbType.DateTime;
                    command.Parameters.Add(param);
                    #endregion @SD
                    #region  @ED
                    param  = new SqlParameter();
                    param.ParameterName="@ED";
                    param.Value=EndDate;
                    param.DbType=DbType.DateTime;
                    command.Parameters.Add(param);
                    #endregion @ED
                    #endregion Param
                    SqlDataReader reader = command.ExecuteReader();
                    while(reader.Read())
                    {
                        DepartmentDto d=new DepartmentDto();
                        #region Fill Model
                        try{d.Id=reader.GetInt32(0);}catch{}
                        try{d.Department=reader.GetString(1);}catch{}
                        try{d.Amount=reader.GetDecimal(2);}catch{}
                        #endregion Fill Model
                        lm.Add(d);
                    }
                }
            }
            #endregion Execute SQL
            return lm.OrderBy(x => x.Department).ToList<DepartmentDto>();
        }
    }
}