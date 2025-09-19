using CavistaEventCelebration.Api.Data;
using CavistaEventCelebration.Api.Models;
using CavistaEventCelebration.Api.Models.EmailService;
using CavistaEventCelebration.Api.Repositories.Implementation;
using CavistaEventCelebration.Api.Repositories.Interface;
using CavistaEventCelebration.Api.Services.implementation;
using CavistaEventCelebration.Api.Services.Implementation;
using CavistaEventCelebration.Api.Services.Interface;
using Microsoft.AspNetCore.Identity;
using Hangfire;
using Hangfire.PostgreSql;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

var port = Environment.GetEnvironmentVariable("PORT") ?? "5000";
builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenAnyIP(int.Parse(port));
});

// Services
builder.Services.AddScoped<IEmployeeService, EmployeeService>();
builder.Services.AddScoped<IEmployeeRepo, EmployeeRepo>();
builder.Services.AddScoped<IEventRepo, EventRepo>();
builder.Services.AddTransient<IMailService, MailService>();
builder.Services.AddTransient<IEventCelebrationService, EventCelebrationService>();
builder.Services.Configure<MailSettings>(builder.Configuration.GetSection(nameof(MailSettings)));

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Cavista Event Celebration API",
        Version = "v1"
    });
});


var connectionString = Environment.GetEnvironmentVariable("DB_CONNECTION_STRING")
                      ?? builder.Configuration.GetConnectionString("DefaultConnection");

Console.WriteLine($"DB Connection: {connectionString}");

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));

builder.Services.AddIdentity<ApplicationUser, IdentityRole<Guid>>()
    .AddEntityFrameworkStores<AppDbContext>();

// Hangfire
builder.Services.AddHangfire(config =>
    config.UsePostgreSqlStorage(connectionString));
builder.Services.AddHangfireServer();

var app = builder.Build();


using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();

    var notificationService = scope.ServiceProvider.GetRequiredService<IEventCelebrationService>();
    notificationService.RegisterRecurringJobsAsync().GetAwaiter().GetResult();
}

if (!app.Environment.IsProduction())
{
    app.UseHttpsRedirection();
}

app.UseRouting();
//app.UseAuthentication();
app.UseAuthorization();

app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Cavista Event Celebration API v1");
});

app.UseHangfireDashboard("/eventjobs");

app.MapControllers();
app.Run();
