using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Sharp.Models;
using Microsoft.AspNetCore.Authorization;
using Sharp.Ado;
namespace Sharp.Controllers
{
    [Authorize]
    [Route("api/items")]
    public class ItemController:Controller
    {
        private Repository repo;
        public ItemController(Repository _repo)
        {
            repo=_repo;
        }
        [HttpPost("sales")]
        public IEnumerable<ItemDto> GetItemSales([FromBody] StoreDto m)
         {
            return repo.GetItemSales(m);
         }
    }
}