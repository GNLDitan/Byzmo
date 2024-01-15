
using System;

namespace ByzmoApi.Models
{
    public class PaymongoWebhooks
    {
        public WehookData Data { get; set; }
    }

    public class WehookData
    {
        public string Id { get; set; }
        public string Type { get; set; }
        public WebhookAttribute Attributes { get; set; }
    }

    public class WebhookAttribute
    {
        public string Type { get; set; }
        public string Livemode { get; set; }
        public Data Data { get; set; }
    }

    public class Data
    {
        public string Id { get; set; }
        public string Type { get; set; }
        public Attribute Attributes { get; set; }
    }


    public class Attribute
    {
        public int Amount { get; set; }
        public Billing Billing { get; set; }
        public string Currency { get; set; }
        public bool Livemode { get; set; }
        public Redirect Redirect { get; set; }
        public string Status { get; set; }
        public string Type { get; set; }
        public string Created_at { get; set; }
    }


    public class Redirect
    {
        public string Checkout_url { get; set; }
        public string Failed { get; set; }
        public string Success { get; set; }
    }

    public class Billing
    {
        public Address Address { get; set; }
        public string Email { get; set; }
        public string Name { get; set; }
        public string Phone { get; set; }
    }

    
    public class Address
    {
        public string City { get; set; }
        public string Country { get; set; }
        public string Line1 { get; set; }
        public string Line2 { get; set; }
        public string Postal_code { get; set; }
        public string State { get; set; }
    }


}