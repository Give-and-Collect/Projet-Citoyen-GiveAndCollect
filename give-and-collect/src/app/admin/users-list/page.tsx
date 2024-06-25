import UsersTable from "@/components/Admin/UsersList/UsersTable";
import { Typography } from "@mui/material";

export default function UsersList() {
    return (
      <>
        <Typography 
          color="primary" 
          textAlign="center" 
          textTransform="uppercase" 
          fontWeight={'bold'} 
          fontSize={32}
          mt={5}
        >
          Liste des utilisateurs
        </Typography>

        <UsersTable />
      </>
    );
  }