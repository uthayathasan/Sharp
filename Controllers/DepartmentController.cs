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
    [Route("api/departments")]
    public class DepartmentController:Controller
    {
        private Repository repo;
        public DepartmentController(Repository _repo)
        {
            repo=_repo;
        }
        [HttpPost("sales")]
         public IEnumerable<DepartmentDto> GetDepartmentSales([FromBody] StoreDto m)
         {
            return repo.GetDepartmentSales(m);
         }
    }
}