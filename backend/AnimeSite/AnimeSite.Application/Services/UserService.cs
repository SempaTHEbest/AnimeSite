using AnimeSite.Core.Abstractions;
using AnimeSite.Core.Models;

namespace AnimeSite.Application.Services;

public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IJwtProvider _jwtProvider;

    public UserService(
        IUserRepository userRepository,
        IPasswordHasher passwordHasher,
        IJwtProvider jwtProvider)
    {
        _userRepository = userRepository;
        _passwordHasher = passwordHasher;
        _jwtProvider = jwtProvider;
    }

    public async Task Register(string username, string email, string password)
    {
        var existingUser = await _userRepository.GetByEmail(email);
        
        if (existingUser != null)
        {
            throw new Exception("User with this email already exists");
        }
        
        var hashedPassword = _passwordHasher.Generate(password);

        var (user, error) = User.Create(Guid.NewGuid(), username, email, hashedPassword);
        if (!string.IsNullOrEmpty(error))
        {
            throw new ArgumentException(error);
        }

        await _userRepository.Add(user);
    }

    public async Task<string> Login(string email, string password)
    {
        var user = await _userRepository.GetByEmail(email);
        if (user == null)
        {
            throw new Exception("User with this email does not exist");
        }
        
        var result = _passwordHasher.Verify(password, user.PasswordHash);
        if (result == false)
        {
            throw new Exception("Password does not match");
        }

        var token = _jwtProvider.GenerateToken(user);
        return token;
    }

    public async Task<string> LoginGoogle(string email, string googleId, string username)
    {
        var user = await _userRepository.GetByEmail(email);

        if (user == null)
        {
            var (newUser, error) = User.CreateGoogleUser(Guid.NewGuid(), email, googleId);
            if(!string.IsNullOrEmpty(error)) throw new ArgumentException(error);
            await _userRepository.Add(newUser);
            user = newUser;
        }
        var token  = _jwtProvider.GenerateToken(user);
        return token;
    }

    public async Task<List<User>> GetAllUsers()
    {
        return await _userRepository.GetAll();
    }

    public async Task<User?> GetById(Guid Id)
    {
        return await _userRepository.GetById(Id);
    }
}