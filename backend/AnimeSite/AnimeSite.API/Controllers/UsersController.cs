using System.Security.Claims;
using AnimeSite.API.Contracts.Auth;
using AnimeSite.Core.Abstractions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AnimeSite.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;

    public UsersController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpPost("register")]
    public async Task<ActionResult> Register([FromBody] RegisterUserRequest request)
    {
        try
        {
            await _userService.Register(request.Username, request.Email, request.Password);
            return Ok();
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPost("login")]
    public async Task<ActionResult<string>> Login([FromBody] LoginUserRequest request)
    {
        try
        {
            var token = await _userService.Login(request.Email, request.Password);
            return Ok(token);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPost("google-login")]
    public async Task<ActionResult<string>> LoginGoogle([FromBody] LoginGoogleRequest request)
    {
        try
        {
            var token = await _userService.LoginGoogle(request.Email, request.GoogleId, request.Username);
            return Ok(token);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
    
    // GET ALL
    [HttpGet]
    public async Task<ActionResult<List<UserResponse>>> GetAll()
    {
        var users = await _userService.GetAllUsers();

        var response = users.Select(u => new UserResponse(
            u.Id,
            u.Username,
            u.Email,
            u.AvatarUrl, // Тепер ці поля передаються
            u.Bio        // Тепер ці поля передаються
        ));
        
        return Ok(response);
    }

    // GET BY ID (Для профілю)
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<UserResponse>> GetById(Guid id)
    {
        var user = await _userService.GetById(id);

        if (user == null)
        {
            return NotFound();
        }
        
        var response = new UserResponse(
            user.Id,
            user.Username,
            user.Email,
            user.AvatarUrl, // <-- Важливо: повертаємо аватарку
            user.Bio        // <-- Важливо: повертаємо опис
        );
        
        return Ok(response);
    }

    [HttpPut("profile")] 
    [Authorize]
    public async Task<ActionResult> UpdateProfile([FromBody] UpdateProfileRequest request)
    {
        var userId = GetUserId();
        
        try 
        {
            // УВАГА: Переконайся, що порядок аргументів тут співпадає з твоїм IUserService!
            // Зазвичай це: (id, avatarUrl, bio)
            await _userService.UpdateProfile(userId, request.AvatarUrl, request.Bio);
            return Ok();
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    // Допоміжний метод для витягування ID з токена
    private Guid GetUserId()
    {
        var idClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
        
        if (idClaim == null)
        {
            throw new Exception("User not authorized or token is invalid");
        }

        return Guid.Parse(idClaim.Value);
    }
}