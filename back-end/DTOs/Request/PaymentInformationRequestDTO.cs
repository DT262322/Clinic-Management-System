namespace back_end.DTOs.Request;

/*
 * model này này sẽ chứa các thông tin của hóa đơn cần thanh toán.
 */
public class PaymentInformationRequestDto
{
    public string OrderType { get; set; }
    public double Amount { get; set; }
    public string OrderDescription { get; set; }
    public string Name { get; set; }
}