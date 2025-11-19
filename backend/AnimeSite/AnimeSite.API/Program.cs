using AnimeSite.Core.Abstractions;
using AnimeSite.DataAccess;
using AnimeSite.DataAccess.Repositories;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

//Connect DB
builder.Services.AddDbContext<AnimeSiteDbContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
});

//Add repositories
builder.Services.AddScoped<IAnimeRepository,  AnimeRepository>();
builder.Services.AddScoped<IGenreRepository,  GenreRepository>();
builder.Services.AddScoped<IEpisodeRepository, EpisodeRepository>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.MapControllers();

app.Run();
