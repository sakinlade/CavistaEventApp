namespace CavistaEventCelebration.Api.Dto
{
    public class Response<T>
    {
        public bool IsSuccessful { get; set; }
        public string SuccessMessage { get; set; }
        public string ErrorMessage { get; set; }
        public T Data { get; set; }

        public static Response<T> Success(T data, string successMessage = null) =>
            new()
            { IsSuccessful = true, Data = data, SuccessMessage = successMessage };

        public static Response<T> Failure(string errorMessage) =>
            new()
            { IsSuccessful = false, ErrorMessage = errorMessage };
    }
}
