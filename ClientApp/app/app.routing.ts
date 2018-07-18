import{Routes,RouterModule} from "@angular/router";
import { AuthenticationGuard } from "./auth/authentication.guard";
import { AuthenticationComponent } from "./auth/authentication.component";
const routes : Routes=[
    { path: "login", component: AuthenticationComponent }
]
export const RoutingConfig=RouterModule.forRoot(routes);