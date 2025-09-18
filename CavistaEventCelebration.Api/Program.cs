using CavistaEventCelebration.Api;
using CavistaEventCelebration.Api.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

var port = Environment.GetEnvironmentVariable("PORT") ?? "5000";
builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenAnyIP(int.Parse(port));
});

builder.AddServices();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();   //this ensures migrations run
}

app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Cavista Event Celebration API v1");
});

if (!app.Environment.IsProduction())
{
    app.UseHttpsRedirection();
}

app.UseCors(ServiceRegistraion.policyName);

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

var serviceprovider = app.Services.CreateScope().ServiceProvider;

if(serviceprovider != null)
      await SeedData.Initialize(serviceprovider);

app.Run();
