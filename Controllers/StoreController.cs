using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Sharp.Models;
using Microsoft.AspNetCore.Authorization;
namespace Sharp.Controllers
{
    [Authorize]
    [Route("api/stores")]
    public class StoreController:Controller
    {
        private DataContext Context;
        public StoreController(DataContext ctx)
        {
            Context=ctx;
        }

        [HttpGet]
        public IEnumerable<Store> GetStores()
        {
            return Context.Stores;
        }

        [HttpGet("{id}")]
        public IEnumerable<Store> GetStore(string id)
        {
            List<UserStore> userStores=Context.UserStores.Where(x=>x.UserId.Equals(id)).ToList<UserStore>();
            return Context.Stores.Where(x=>userStores.Select(y=>y.StoreId).Contains(x.StoreId));
        }
    }

}