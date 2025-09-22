using CavistaEventCelebration.Api;
using CavistaEventCelebration.Api.Data;
using CavistaEventCelebration.Api.Services.Interface;
using Hangfire;
using Microsoft.EntityFrameworkCore;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

var port = Environment.GetEnvironmentVariable("PORT") ?? "5000";
builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenAnyIP(int.Parse(port));
});

var policyName = "CorsPolicy";
ServiceRegistration.AddServices(builder, policyName);
var app = builder.Build();

// Migrate DB
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();

    var notificationService = scope.ServiceProvider.GetRequiredService<IEventCelebrationService>();
    notificationService.RegisterRecurringJobsAsync().GetAwaiter().GetResult();
    await SeedData.Initialize(scope.ServiceProvider);
}

if (app.Environment.IsProduction())
{
    app.UseHttpsRedirection();
}

app.UseSerilogRequestLogging();
app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Cavista Event Celebration API v1");
});

app.UseHangfireDashboard("/eventjobs");
app.UseCors(policyName);
app.MapControllers();

app.Run();
