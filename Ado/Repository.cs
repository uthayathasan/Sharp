using System.Collections.Generic;
using System.Linq;
using Sharp.Models;

namespace Sharp.Ado
{
    public class Repository
    {
        private DataContext Context;
        public Repository(DataContext ctx)
        {
            Context=ctx;
        }
        public List<DepartmentDto> GetDepartmentSales(StoreDto m)
        {
            DepartmentSales ob=new DepartmentSales();
            List<Store> stores=Context.Stores.Where(x=>x.Id==m.Id).ToList<Store>();
            if(stores.Count>0)
            {
                m.PublicIp=stores[0].PublicIp;
                m.Port=stores[0].Port;
                m.DataBase=stores[0].DataBase;
            }
            return ob.GetDepartmentSales(m);
        }
    }
}