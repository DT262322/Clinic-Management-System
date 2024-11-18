using back_end.DTOs.Request;
using back_end.DTOs.Response;

namespace back_end.Services;

public interface IVnPayService
{
    string CreatePaymentUrl(PaymentInformationRequestDto requestDto, HttpContext context);
    PaymentResponseDto PaymentExecute(IQueryCollection collections);
}