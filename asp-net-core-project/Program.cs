using System.Security.Claims;
using asp_net_core_project.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;

var connectionString = $"Server={Environment.GetEnvironmentVariable("POSTGRES_SERVER")};" +
                       $"Port={Environment.GetEnvironmentVariable("POSTGRES_PORT")};" +
                       $"Database={Environment.GetEnvironmentVariable("POSTGRES_DB")};" +
                       $"User Id={Environment.GetEnvironmentVariable("POSTGRES_USER")};" +
                       $"Password={Environment.GetEnvironmentVariable("POSTGRES_PASSWORD")};";

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi

builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    options.UseNpgsql(connectionString);
});
builder.Services.AddOpenApi();
builder.Services.AddCors();
builder.Services.AddAuthorization();
builder.Services.AddIdentityApiEndpoints<ApplicationUser>()
    .AddEntityFrameworkStores<ApplicationDbContext>();

// Add Swagger services
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "My API", Version = "v1" });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1"));
}

app.MapIdentityApi<ApplicationUser>();

app.MapPost("/logout", async (HttpContext context, SignInManager<ApplicationUser> signInManager) =>
{
    await signInManager.SignOutAsync();
    return Results.Ok();
}).RequireAuthorization();

app.MapGet("/pingauth", (ClaimsPrincipal user) =>
{
    var email = user.FindFirstValue(ClaimTypes.Email);
    return Results.Json(new { Email = email });
}).RequireAuthorization();

app.UseCors(p => p.WithOrigins("http://localhost:3000").AllowAnyMethod().AllowAnyHeader());
app.UseHttpsRedirection();

app.Run();
