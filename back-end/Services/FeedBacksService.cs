using back_end.Data;

namespace back_end.Services;

public class FeedBacksService
{
    private readonly DataContext _context;

    public FeedBacksService(DataContext context)
    {
        _context = context;
    }
}