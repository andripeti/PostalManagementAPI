using QRCoder;

namespace App.Core
{
    public static class Helpers
    {
        public static string CreateQRCode(string name, string content)
        {
            var qrGenerator = new QRCodeGenerator();
            var qrCodeData = qrGenerator.CreateQrCode(content, QRCodeGenerator.ECCLevel.Q);
            var qrCode = new QRCode(qrCodeData);
            var filename = Path.Combine("assets", "qr-codes", $"{name}.png");

            if (!File.Exists(filename))
            {
                using (var bitmap = qrCode.GetGraphic(20)) // This generates the QR code as an image
                {
                    bitmap.Save(filename);
                }
            }

            return filename;
        }

        //public static string CreateBarcode(string name, string content)
        //{
        //    var barcodeWriter = new BarcodeWriter
        //    {
        //        Format = BarcodeFormat.CODE_128,
        //        Options = new ZXing.Common.EncodingOptions
        //        {
        //            Width = 300,
        //            Height = 100
        //        }
        //    };

        //    var barcodeBitmap = barcodeWriter.Write(content);
        //    var filename = Path.Combine("assets", "barcodes", $"{name}.png");

        //    if (!File.Exists(filename))
        //    {
        //        barcodeBitmap.Save(filename);
        //    }

        //    return filename;
        //}

        public static string Hide(string input)
        {
            var length = input.Length;
            if (length <= 2)
            {
                return input;
            }

            var hidden = input.Substring(0, 1);
            hidden += new string('*', length - 2);
            hidden += input.Substring(length - 1, 1);

            return hidden;
        }

        public static int CalculateDistance(string startAddress, string endAddress)
        {
            var apiKey = Environment.GetEnvironmentVariable("GOOGLE_API_KEY");
            var url = $"https://maps.googleapis.com/maps/api/directions/json?origin={startAddress}&destination={endAddress}&alternatives=false&sensor=false&key={apiKey}";

            using (var httpClient = new HttpClient())
            {
                try
                {
                    var response = httpClient.GetAsync(url).Result; // Synchronous call
                    if (response.IsSuccessStatusCode)
                    {
                        var content = response.Content.ReadAsStringAsync().Result; // Wait for the result synchronously
                        var json = Newtonsoft.Json.Linq.JObject.Parse(content);
                        var distance = json["routes"]?[0]["legs"]?[0]["distance"]?["value"]?.ToObject<int>();

                        return distance ?? 999999999;
                    }
                    else
                    {
                        Console.WriteLine($"Unexpected HTTP status: {response.StatusCode}");
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error: {ex.Message}");
                }
            }

            return 999999999; // Default value in case of failure
        }


        public static string GenerateRandomString(int numOfCharacters)
        {
            const string characters = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+{}|:<>?~";
            var random = new Random();
            var randomString = new char[numOfCharacters];

            for (int i = 0; i < numOfCharacters; i++)
            {
                randomString[i] = characters[random.Next(characters.Length)];
            }

            return new string(randomString);
        }
    }
}
