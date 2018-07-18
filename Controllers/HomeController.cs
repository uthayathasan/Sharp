using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Sharp.Models;

namespace Sharp.Controllers
{
    public class HomeController : Controller
    {
        private DataContext Context;
        public HomeController(DataContext ctx)
        {
            Context=ctx;
        }
        public IActionResult Index()
        {
            ViewBag.Message = "Sharp App";
            return View(Context.UserStores.First());
        }
    }
}
