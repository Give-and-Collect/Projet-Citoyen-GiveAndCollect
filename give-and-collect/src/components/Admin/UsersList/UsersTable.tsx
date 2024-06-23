"use client";

import { Button } from "@mui/material";
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useEffect, useState } from "react";

const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90, minWidth: 90  },
    { field: 'firstname', headerName: 'Prénom', flex: 1, minWidth: 150},
    { field: 'lastname', headerName: 'Nom', flex: 1, minWidth: 150},
    { field: 'role', headerName: 'Rôle', width: 130, minWidth: 130},
    { field: 'adsPosted', headerName: 'Annonces postées', type: 'number', width: 150, minWidth: 150},
    { field: 'eventsPosted', headerName: 'Evènements postés', type: 'number', width: 150, minWidth: 150},
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      width: 150,
      minWidth: 150,
      renderCell: (params) => (
        <Button onClick={() => handleDelete(params.row.id)} variant="contained" color="error">
          Supprimer
        </Button>
      ),
    },
  ];
  
  const handleDelete = (id: number) => {
    fetch(`../api/users/${id}`, {
      method: 'DELETE',
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
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
        role: string;
        adsPosted: number;
        eventsPosted: number;
    };
  
  export default function UsersTable() {
    const [users, setUsers] = useState<User[]>([]);

    // fetch users data
    useEffect(() => {
        const fetchData = async () => {
            try {
            const response = await fetch('../api/users');
            const data = await response.json();
            console.log('Data expected :', data);
            // Déconstruction du json pour obtenir les données attendues
            const usersData = data.map((user: any) => ({
                id: user.id,
                firstname: user.firstname,
                lastname: user.lastname,
                role: user.role,
                adsPosted: user.posts._count,
                eventsPosted: user.events._count,
            }));
            setUsers(usersData);
            } catch (error) {
            console.error(error);
            }
        }
        fetchData();
    }, []);

    return (
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
            borderRadius: 5,
          }}
        />
      </div>
    );
  }