using System.ComponentModel.DataAnnotations;

namespace Sharp.Models
{
    public class UserStore
    {
        public long Id{get;set;}
        [StringLength(50)]
        public string UserId {get;set;}="";

        [StringLength(50)]
        public string StoreId{get;set;}="";
        [StringLength(50)]
        public string UserRole{get;set;}="";
    }
}