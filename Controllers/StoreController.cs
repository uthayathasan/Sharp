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
        public IEnumerable<Store> GetStores()
        {
            return Context.Stores;
        }

    }
}