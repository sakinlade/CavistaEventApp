using CavistaEventCelebration.Api;
using CavistaEventCelebration.Api.Data;
using CavistaEventCelebration.Api.Models;
using CavistaEventCelebration.Api.Models.EmailService;
using CavistaEventCelebration.Api.Repositories.Implementation;
using CavistaEventCelebration.Api.Repositories.Interface;
using CavistaEventCelebration.Api.Services.implementation;
using CavistaEventCelebration.Api.Services.Implementation;
using CavistaEventCelebration.Api.Services.Interface;
using Hangfire;
using Hangfire.PostgreSql;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

var port = Environment.GetEnvironmentVariable("PORT") ?? "5000";
builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenAnyIP(int.Parse(port));
});

var policyName = "CorsPolicy";
ServiceRegistraion.AddServices(builder, policyName);
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
