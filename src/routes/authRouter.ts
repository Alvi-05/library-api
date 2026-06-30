import { Router, type Request, type Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../data-source.ts';
import { User } from '../entities/User.ts';
import { JWT_SECRET } from '../middlewares/authMiddleware.ts';

const router = Router();
const userRepository = AppDataSource.getRepository(User);

router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    // Check if user exists
    const existingUser = await userRepository.findOneBy({ user_email: email });
    if (existingUser) return res.status(400).json({ error: 'User already exists' });

    // Hash password & save
    const hashedPassword = await bcrypt.hash(password, 10);
    await userRepository.insert({ user_email: email, password: hashedPassword });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await userRepository.findOne({
      where: { user_email: email },
      relations: { role: true },
    });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ error: 'Invalid credentials' });

    if (!user.role) {
      return res.status(403).json({ error: 'User has no role assigned' });
    }

    // Generate token
    const token = jwt.sign(
      {
        id: user.user_id,
        email: user.user_email,
        role: { role_name: user.role.role_name },
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

export default router;