import{Routes,RouterModule} from "@angular/router";
import { AdminComponent } from "./admin/admin.component";
import { OverviewComponent } from "./admin/overview.component";
import { AuthenticationGuard } from "./auth/authentication.guard";
import { AuthenticationComponent } from "./auth/authentication.component";
const routes : Routes=[
    { path: "login", component: AuthenticationComponent },
    { path: "", redirectTo: "/admin/overview", pathMatch: "full"},
    { path: "admin", redirectTo: "/admin/overview", pathMatch: "full"},
    {
        path: "admin", component: AdminComponent,
        canActivateChild: [AuthenticationGuard],
        children: [
            { path: "overview", component: OverviewComponent },
            { path: "", component: OverviewComponent }]}
]
export const RoutingConfig=RouterModule.forRoot(routes);