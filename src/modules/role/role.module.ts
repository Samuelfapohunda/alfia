import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Role, RoleSchema } from "src/models/role.model";
import { RoleController } from "./role.controller";
import { RoleService } from "./role.service";
import { AdminService } from "../admin/admin.service";
import { Admin, AdminSchema } from "src/models/admin.model";
import { EmailService } from "../email/email.service";
import { MailService } from "src/common/services/mail.service";
import { User, UserSchema } from "src/models/user.model";

@Module({
   imports:[
      MongooseModule.forFeature([
         { name: Role.name, schema: RoleSchema},
         { name: Admin.name, schema: AdminSchema},
         { name: User.name, schema: UserSchema},

      ]),
   ],
   controllers: [RoleController],
   providers: [RoleService, AdminService, EmailService, MailService ],
})

 
export class RoleModule {};
