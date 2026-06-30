import type { Request, Response, NextFunction } from "express";
import { RoleService } from "../services/RoleService.ts";
import { Logger } from "../utils/Logger.ts";

export class RoleController {
  private roleService = new RoleService();

  public createRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    Logger.info(`RoleController: POST /roles triggered`);
    try {
      const { role_name, description } = req.body;
      const role = await this.roleService.createRole(role_name, description);
      res.status(201).json({ success: true, data: role });
      Logger.info(`RoleController: Successfully created role`, { role_id: role.role_id, role_name: role.role_name });
    } catch (error) {
      Logger.error(`RoleController: Error creating role`, { error });
      next(error);
    }
  };
}