using PostalManagementAPI.Services;

public class Helpers
{
    private readonly DeliveryService _deliveryService;

    private static Random _random = new Random();

    public Helpers(DeliveryService deliveryService)
    {
        _deliveryService = deliveryService;
    }

    public static string GenerateTrackingNumber()
    {
        long number = (long)(_random.Next(100000, 999999) * 1_000_000) + _random.Next(100000, 999999);

        return number.ToString();
    }

    public async Task<string> GenerateUniqueTrackingNumberAsync()
    {
        string trackingNumber;
        bool exists;

        do
        {
            trackingNumber = GenerateTrackingNumber();
            exists = await _deliveryService.GetByTrackingNumberAsync(trackingNumber) != null;
        }
        while (exists);

        return trackingNumber;
    }
}
