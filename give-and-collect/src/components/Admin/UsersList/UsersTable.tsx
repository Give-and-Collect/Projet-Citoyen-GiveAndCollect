"use client";

import Loader from "@/components/Loader/Loader";
import { Button, MenuItem, Select, Typography } from "@mui/material";
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { frFR } from '@mui/x-data-grid/locales';
import { Role } from "@prisma/client";
import { useEffect, useState } from "react";

const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90, minWidth: 90 },
    { field: 'firstname', headerName: 'Prénom', flex: 1, minWidth: 150 },
    { field: 'lastname', headerName: 'Nom', flex: 1, minWidth: 150 },
    { 
      field: 'role', 
      headerName: 'Rôle', 
      width: 150, 
      minWidth: 150,
      renderCell: (params) => {
        function handleRoleChange(id: number, newValue: number): void {
          try {
            fetch(`../api/users/${id}`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ roleId: newValue }),
            })
              .then((response) => response.json())
              .catch((error) => {
                console.error(error);
              });
          }
          catch (error) {
            console.error(error);
          }
        }

            return (
                <RoleSelect
                    currentRole={params.row.roleId}
                    onChange={(newValue) => handleRoleChange(params.row.id, newValue)}
                    data-testid={`role-select-${params.row.id}`}
                />
            );
        }
    },
    { field: 'adsPosted', headerName: 'Annonces postées', type: 'number', width: 150, minWidth: 150 },
    { field: 'eventsPosted', headerName: 'Evènements postés', type: 'number', width: 150, minWidth: 150 },
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      width: 150,
      minWidth: 150,
      renderCell: (params) => (
        // If role is admin, the delete button is disabled
        params.row.roleId === 1 ?
        <Button disabled variant="contained" color="error">
          Supprimer
        </Button>
        :
        <Button onClick={() => handleDelete(params.row.id)} variant="contained" color="error">
          Supprimer
        </Button>
      ),
    },
  ];

  const RoleSelect = ({ currentRole, onChange }: { currentRole: number, onChange: (newValue: number) => void }) => {

    const [roles, setRoles] = useState<Role[]>([]);

    const [roleSelected, setRoleSelected] = useState(currentRole);

    useEffect(() => {
      const fetchRoles = async () => {
        try {
          const response = await fetch('../api/role');
          const data = await response.json();
          setRoles(data);
        } catch (error) {
          console.error(error);
        }
      }
      fetchRoles();
    }, []);

    const handleChange = (newValue: number) => {
      setRoleSelected(newValue);
      onChange(newValue);
    }

    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <Select
          value={roleSelected}
          onChange={(e) => handleChange(Number(e.target.value))}
          style={{ width: '100%', height: 40 }}
          disabled={currentRole === 1}
        >
          {roles.map((role) => (
            <MenuItem key={role.id} value={role.id}>{role.name}</MenuItem>
          ))}
        </Select>
      </div>
    );
  };
  
  const handleDelete = (id: number) => {
    fetch(`../api/users/${id}`, {
      method: 'DELETE',
    })
      .then((response) => response.json())
      .then((data) => {
        window.location.reload();
      })
      .catch((error) => {
        console.error(error);
      });
  };
  
    type User = {
        id: number;
        firstname: string;
        lastname: string;
        roleId: number;
        role: string;
        adsPosted: number;
        eventsPosted: number;
    };
  
  export default function UsersTable() {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // fetch users data
    useEffect(() => {
        const fetchData = async () => {
            try {
              setIsLoading(true);
              const response = await fetch('../api/users');
              const data = await response.json();
              // Déconstruction du json pour obtenir les données attendues
              const usersData = data.map((user: any) => ({
                  id: user.id,
                  firstname: user.firstname,
                  lastname: user.lastname,
                  roleId: user.roleId,
                  role: user.role,
                  adsPosted: user.posts._count,
                  eventsPosted: user.events._count,
              }));
              setUsers(usersData);
            } catch (error) {
              console.error(error);
            } finally {
              setIsLoading(false);
            }
        }
        fetchData();
    }, []);

    return (
        <>
            {isLoading ? (
                <Loader />
            ) : (
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
                    <div style={{ marginLeft: 'auto', marginRight: 'auto', marginTop: 50, marginBottom: 50, width: '90%' }}>
                        <DataGrid
                            rows={users}
                            columns={columns}
                            initialState={{
                                pagination: {
                                    paginationModel: { page: 0, pageSize: 5 },
                                },
                            }}
                            pageSizeOptions={[5, 10]}
                            autoPageSize
                            sx={{
                                height: 400,
                                width: '100%',
                            }}
                            localeText={frFR.components.MuiDataGrid.defaultProps.localeText}
                            data-testid="users-table"
                        />
                    </div>
                </>
            )}
        </>
    );
  }