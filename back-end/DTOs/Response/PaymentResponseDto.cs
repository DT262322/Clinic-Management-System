namespace back_end.DTOs.Response;

public class PaymentResponseDto
{
    public string PaymentId { get; set; }
    public bool Success { get; set; }
    public string Token { get; set; }
    public string VnPayResponseCode { get; set; }
}