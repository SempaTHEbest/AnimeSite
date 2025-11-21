using AnimeSite.API.Contracts.Auth;
using AnimeSite.Core.Abstractions;
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
    
    //GET
    [HttpGet]
    public async Task<ActionResult<List<UserResponse>>> GetAll()
    {
        var users = await _userService.GetAllUsers();

        var response = users.Select(u => new UserResponse(
            u.Id,
            u.Username,
            u.Email));
        return Ok(response);
    }

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
            user.Email);
        return Ok(response);
    }

}