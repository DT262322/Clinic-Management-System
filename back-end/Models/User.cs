using Microsoft.AspNetCore.Identity;

namespace back_end.Models
{
    public class User : IdentityUser
    {

        public User()
        {
            PhoneNumber = "";
            EmailConfirmed = true;
            PhoneNumberConfirmed = false;
            TwoFactorEnabled = false;
            LockoutEnabled = false;
            AccessFailedCount = 0;
            SecurityStamp = Guid.NewGuid().ToString();

        }
    }
}