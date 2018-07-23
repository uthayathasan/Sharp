import{Routes,RouterModule} from "@angular/router";
import { AdminComponent } from "./admin/admin.component";
import { StoresComponent } from "./admin/stores.component";
import { AuthenticationGuard } from "./auth/authentication.guard";
import { AuthenticationComponent } from "./auth/authentication.component";
import {NodesComponent} from "./admin/nodes.component";
import { ChildsComponent } from "./admin/childs.component";
const routes : Routes=[
    { path: "login", component: AuthenticationComponent },
    { path: "", redirectTo: "/admin/stores", pathMatch: "full"},
    { path: "admin", redirectTo: "/admin/stores", pathMatch: "full"},
    {
        path: "admin", component: AdminComponent,
        canActivateChild: [AuthenticationGuard],
        children: [
            { path: "stores", component: StoresComponent },
            {path:"nodes",component:NodesComponent},
            {path:"childs",component:ChildsComponent},
            { path: "", component: StoresComponent }]}
]
export const RoutingConfig=RouterModule.forRoot(routes);