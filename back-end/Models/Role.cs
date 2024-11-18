using Microsoft.AspNetCore.Identity;

namespace back_end.Models
{
    public class Role : IdentityRole
    {
        public Role() : base() { }

        public Role(string roleName) : base(roleName) { }
    }
}
