using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace Sharp.Models
{
    public class SeedData
    {
        public static void SeedDatabase(DataContext context)
        {
            
            if(context.Database.GetMigrations().Count() > 0 && context.Database.GetPendingMigrations().Count() == 0 )
            {
                if(context.UserStores.Count() == 0)
                {
                    UserStore us=new UserStore();
                    us.UserId="uthayathasan@yahoo.com";
                    us.StoreId="VF1";
                    us.UserRole="Admin";
                    context.UserStores.Add(us);
                    context.SaveChanges();
                }
                if(context.Stores.Count()==0)
                {
                    context.Stores.AddRange(
                        new Store{StoreId="VF1",
                                StoreName="Visual Fresh",
                                Address="Richmond Road",
                                City="Kingston",
                                PostCode="KT1 5WS",
                                PublicIp="192.168.1.100",
                                Port=2000,
                                DataBase="EposV3"},
                        new Store{StoreId="VF2",
                                StoreName="Visual Sharp",
                                Address="Richmond Road",
                                City="Kingston",
                                PostCode="KT1 5WK",
                                PublicIp="192.168.1.101",
                                Port=2001,
                                DataBase="EposV3"});
                     context.SaveChanges();
                }
            }

        }
    }
}