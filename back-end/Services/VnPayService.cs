using back_end.DTOs.Request;
using back_end.DTOs.Response;
using back_end.Utils;

namespace back_end.Services;
public class VnPayService : IVnPayService
{
    private readonly IConfiguration _configuration;

    public VnPayService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    /// <summary>
    /// CreatePaymentUrl sẽ có trách nhiệm tạo ra URL thanh toán tại VnPay. 
    /// </summary>
    /// <param name="requestDto">PaymentInformationModel</param>
    /// <param name="context">HttpContext</param>
    /// <returns></returns>
    public string CreatePaymentUrl(PaymentInformationRequestDto requestDto, HttpContext context)
    {
        var timeZoneById = TimeZoneInfo.FindSystemTimeZoneById(_configuration["TimeZoneId"]);
        var timeNow = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, timeZoneById);
        var tick = DateTime.Now.Ticks.ToString();
        var pay = new VnPayUtils();
        var urlCallBack = _configuration["PaymentCallBack:ReturnUrl"];

        pay.AddRequestData("vnp_Version", _configuration["Vnpay:Version"]);
        pay.AddRequestData("vnp_Command", _configuration["Vnpay:Command"]);
        pay.AddRequestData("vnp_TmnCode", _configuration["Vnpay:TmnCode"]);
        pay.AddRequestData("vnp_Amount", ((int)requestDto.Amount * 100).ToString());
        pay.AddRequestData("vnp_CreateDate", timeNow.ToString("yyyyMMddHHmmss"));
        pay.AddRequestData("vnp_CurrCode", _configuration["Vnpay:CurrCode"]);
        pay.AddRequestData("vnp_IpAddr", pay.GetIpAddress(context));
        pay.AddRequestData("vnp_Locale", _configuration["Vnpay:Locale"]);
        pay.AddRequestData("vnp_OrderInfo", $"{requestDto.Name} {requestDto.OrderDescription} {requestDto.Amount}");
        pay.AddRequestData("vnp_OrderType", requestDto.OrderType);
        pay.AddRequestData("vnp_ReturnUrl", urlCallBack);
        pay.AddRequestData("vnp_TxnRef", tick);

        var paymentUrl =
            pay.CreateRequestUrl(_configuration["Vnpay:BaseUrl"], _configuration["Vnpay:HashSecret"]);

        return paymentUrl;
    }

    /// <summary>
    /// kiểm tra thông tin giao dịch và sẽ lưu lại thông tin đó sau khi thanh toán thành công.
    /// </summary>
    /// <param name="collections">IQueryCollection</param>
    /// <returns></returns>
    public PaymentResponseDto PaymentExecute(IQueryCollection collections)
    {
        var pay = new VnPayUtils();
        var response = pay.GetFullResponseData(collections, _configuration["Vnpay:HashSecret"]);

        return response;
    }
}