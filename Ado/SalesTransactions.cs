using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using Sharp.Models;
namespace Sharp.Ado
{
    public class SalesTransactions
    {
        public Transactions GetTransactions(StoreDto m)
        {
            string connectionString="Data Source="+m.PublicIp+"\\SPOSSQL_10,"+m.Port.ToString();
            connectionString +="; Initial Catalog="+m.DataBase+"; User Id=vbr; Password=mg812yn";
            //@StartDate,@EndDate,@PageNumber,@LinesPerPage,@HowManyLines  OUT
            string StartDate=m.StartDate;
            string EndDate=m.EndDate;
            Transactions trans=new Transactions();
            trans.TransHeaders = new List<TransactionHeaders>();
            #region SQL
            string Sql ="declare @HowManyLines int ";
            Sql += "declare @Trans Table ";
            Sql += "(RowNumber int,DateTimeStart datetime,DateTimeEnd datetime,TradingDate datetime,TrnNo bigint,TotValue money,";
            Sql += "TblNo int,Split int,SrvNo int,StructVersion bigint,voidd int,BillPrinted int,CashedOff int,Wastage int,";
            Sql += "Receipted int,nitems int,npayms int,ncovers int,TotalDiscS money,trnsplit bigint,Till int,Shift int) ";

            Sql += "insert into @Trans ";
            Sql += "select ROW_NUMBER() OVER (ORDER BY TrnNo) AS Row,DateTimeStart,DateTimeEnd,TradingDate,TrnNo,TotValue, ";
            Sql += "TblNo,Split,SrvNo,StructVersion,voidd,BillPrinted,CashedOff,Wastage,Receipted,nitems,npayms,ncovers, ";
            Sql += "TotalDiscS,trnsplit,Till,Shift ";
            Sql += "FROM TranHeaders where DateTimeEnd between @StartDate and @EndDate ";
            Sql += "SELECT @HowManyLines = COUNT(RowNumber) FROM @Trans ";

            Sql += "select DateTimeStart,DateTimeEnd,TradingDate,TrnNo,TotValue, ";
            Sql += "TblNo,Split,SrvNo,StructVersion,voidd,";
            Sql += "BillPrinted,CashedOff,Wastage,Receipted,nitems, ";
            Sql += "npayms,ncovers,TotalDiscS,trnsplit,Till,Shift from @Trans ";
            Sql += "WHERE RowNumber > (@PageNumber - 1) * @LinesPerPage ";
            Sql += "AND RowNumber <= @PageNumber * @LinesPerPage; ";

            Sql += "select @HowManyLines ";
            #endregion SQL
            #region Execute SQL
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();
                using (SqlCommand command = new SqlCommand(Sql, connection))
                {
                    #region Param
                    #region @StartDate
                    SqlParameter param  = new SqlParameter();
                    param.ParameterName="@StartDate";
                    param.Value=StartDate;
                    param.DbType=DbType.DateTime;
                    command.Parameters.Add(param);
                    #endregion @StartDate

                    #region @EndDate
                    param  = new SqlParameter();
                    param.ParameterName="@EndDate";
                    param.Value=EndDate;
                    param.DbType=DbType.DateTime;
                    command.Parameters.Add(param);
                    #endregion @EndDate

                    #region @PageNumber
                    param  = new SqlParameter();
                    param.ParameterName="@PageNumber";
                    param.Value=m.PageNumber;
                    param.DbType=DbType.Int32;
                    command.Parameters.Add(param);
                    #endregion @PageNumber

                    #region @LinesPerPage
                    param  = new SqlParameter();
                    param.ParameterName="@LinesPerPage";
                    param.Value=m.LinesPerPage;
                    param.DbType=DbType.Int32;
                    command.Parameters.Add(param);
                    #endregion @LinesPerPage
                    #endregion Param
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            TransactionHeaders h= new TransactionHeaders();
                            // DateTimeStart,DateTimeEnd,TradingDate,TrnNo,TotValue,
                            // TblNo,Split,SrvNo,StructVersion,voidd,
                            // BillPrinted,CashedOff,Wastage,Receipted,nitems,
                            // npayms,ncovers,TotalDiscS,trnsplit,Till,Shift
                            try{h.DateTimeStart =reader.GetDateTime(0);}catch{}
                            try{h.DateTimeEnd = reader.GetDateTime(1);}catch{}
                            try{h.TradingDate = reader.GetDateTime(2);}catch{}
                            try{h.TrnNo = reader.GetInt32(3);}catch{}
                            try{h.TotValue = reader.GetDecimal(4);}catch{}
                            try{h.TblNo = reader.GetInt32(5);}catch{}
                            try{h.Split = reader.GetInt32(6);}catch{}
                            try{h.SrvNo = reader.GetInt32(7);}catch{}
                            try{h.StructVersion = reader.GetInt32(8);}catch{}
                            try{h.voidd = reader.GetInt32(9);}catch{}
                            try{h.BillPrinted = reader.GetInt32(10);}catch{}
                            try{h.CashedOff = reader.GetInt32(11);}catch{}
                            try{h.Wastage = reader.GetInt32(12);}catch{}
                            try{h.Receipted = reader.GetInt32(13);}catch{}
                            try{h.nitems = reader.GetInt32(14);}catch{}
                            try{h.npayms =reader.GetInt32(15);}catch{}
                            try{h.ncovers = reader.GetInt32(16);}catch{}
                            try{h.TotalDiscS = reader.GetDecimal(17);}catch{}
                            try{h.trnsplit = reader.GetInt64(18);}catch{}
                            try{h.Till = reader.GetInt32(19);}catch{}
                            try{h.Shift = reader.GetInt32(20);}catch{}
                            #region Fill Model
                            
                            #endregion Fill Model
                            trans.TransHeaders.Add(h);
                            
                        }
                        if(reader.NextResult())
                        {
                            while(reader.Read())
                            {
                                try{trans.NoOfLines=reader.GetInt32(0);} catch{}
                            }
                        }
                    }
                }
            }
            #endregion Execute SQL

            return trans;
        }
    }
}