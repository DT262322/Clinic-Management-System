using back_end.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace back_end.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FeedbacksController : ControllerBase
    {
        private readonly FeedBacksService _feedBacksService;

        public FeedbacksController(FeedBacksService feedBacksService)
        {
            _feedBacksService = feedBacksService;
        }
    }
}