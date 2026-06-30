import { AppDataSource } from "../data-source.ts";
import { Role } from "../entities/Role.ts";
import { Logger } from "../utils/Logger.ts";

export class RoleService {
  private roleRepository = AppDataSource.getRepository(Role);

  public async createRole(role_name: string, description: string): Promise<Role> {
    Logger.info(`RoleService: Creating new role`, { role_name });
    
    const role = this.roleRepository.create({ role_name, description });
    return await this.roleRepository.save(role);
  }

  public async getRoles(): Promise<Role[]> {
    Logger.info(`RoleService: Fetching all roles`);
    return await this.roleRepository.find();
  }
}