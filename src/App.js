import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { useState, useEffect } from 'react';

function App() {


  const baseUrl="https://localhost:44324/api/gestores";
  const [data, setData]=useState([]);
  const[modalInsertar, setModalInsertar]=useState(false);
  const[modalEditar, setModalEditar]=useState(false);
  const[modalEliminar, setModalEliminar]=useState(false);
  const [gestorSeleccionado, setGestorSeleccionado]=useState ({
    id:'',
    main_task:'',
    secondary_task:''
  })

  const handleChange=e=>{
    const {name, value}=e.target;
    setGestorSeleccionado({
      ...gestorSeleccionado,
      [name]:value
    });
    console.log(gestorSeleccionado)
  }

  const abrirCerrarModal=()=>{
    setModalInsertar(!modalInsertar);
  }

  const abrirCerrarModalEditar=()=>{
    setModalEditar(!modalEditar);
  }

  const abrirCerrarModalEliminar=()=>{
    setModalEliminar(!modalEliminar);
  }
  const peticionGet=async()=>{
    await axios.get(baseUrl)
    .then(response=>{
      setData(response.data); 

    }).catch(error=>{
      console.log(error);
    })
  }

  const peticionPost=async()=>{
    delete gestorSeleccionado.id;
    await axios.post(baseUrl, gestorSeleccionado)
    .then(response=>{
      setData(data.concat(response.data));
      abrirCerrarModal(); 

    }).catch(error=>{
      console.log(error);
    })
  }

  const peticionPut=async()=>{
    
    await axios.put(baseUrl+"/"+gestorSeleccionado.id, gestorSeleccionado)
    .then(response=>{
      var respuesta=response.data;
      var dataAuxiliar=data;
      dataAuxiliar.map(chores=>{
        if(chores.id===gestorSeleccionado.id){
          chores.main_task=respuesta.main_task;
          chores.secondary_task=respuesta.secondary_task;
        }
      });
      abrirCerrarModalEditar();
    }).catch(error=>{
      console.log(error);
    })
  }

  const peticionDelete=async()=>{
    
    await axios.delete(baseUrl+"/"+gestorSeleccionado.id)
    .then(response=>{
     setData(data.filter(chores=>chores.id !== response.data));
     abrirCerrarModalEliminar();
    }).catch(error=>{
      console.log(error);
    })
  }




  const seleccionarGestor=(gestor,caso)=>{
    setGestorSeleccionado(gestor);
    (caso ==="Editar")?  
    abrirCerrarModalEditar(): abrirCerrarModalEliminar();
  }


  useEffect(()=>{
    peticionGet();
  },[])
  return (
    
    <div className="App">
      <br/><br/>
      <button onClick={()=>abrirCerrarModal()} className="btn btn-primary">Insertar nueva tarea</button>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Id</th>
            <th>Tarea_primaria</th>
            <th>Tarea_secundaria</th>
            <th>Acciones</th>

          </tr>
        </thead>

        <tbody>
          {data.map(chores=>(
            <tr key={chores.id}>
              <td>{chores.id}</td>
              <td>{chores.main_task}</td>
              <td>{chores.secondary_task}</td>
              <td> 
                <button className="btn btn-primary" onClick={()=>seleccionarGestor(chores, "Editar"  )}>Editar</button>
                <button className="btn btn-danger" onClick={()=>seleccionarGestor(chores, "Eliminar"  )}>Eliminar</button>
              </td>
            </tr>

          ))}
        </tbody>

      </table>

      <Modal isOpen={modalInsertar}>
        <ModalHeader>Insertar datos</ModalHeader>
          <ModalBody>
            <div className="form-group">
              <label>Tarea primaria:</label>
              <br />
              <input type="text" className="form-control" name="main_task" onChange={handleChange}/>
              <br />
              <label>Tarea secundaria:</label>
              <br />
       <input type="text" className="form-control" name="secondary_task" onChange={handleChange}/>
            </div>

          </ModalBody>
          <ModalFooter>
            <button className="btn btn-primary" onClick={()=>peticionPost()}>insertar</button>{"  "}
            <button className="btn btn-danger" onClick={()=>abrirCerrarModal}>cancelar</button>
          </ModalFooter>
        
      </Modal> 

      <Modal isOpen={modalEditar}>
        <ModalHeader>Modificar datos</ModalHeader>
          <ModalBody>
            <div className="form-group">
            <label>ID:</label>
              <br />
              <input type="text" className="form-control" readOnly value={gestorSeleccionado && gestorSeleccionado.id}/>
              <br />
              <label>Tarea primaria:</label>
              <br />
              <input type="text" className="form-control" name="main_task"  value={gestorSeleccionado && gestorSeleccionado.main_task} onChange={handleChange}/>
              <br />
              <label>Tarea secundaria:</label>
              <br />
       <input type="text" className="form-control" name="secondary_task"  value={gestorSeleccionado && gestorSeleccionado.secondary_task} onChange={handleChange}/>
            </div>

          </ModalBody>
          <ModalFooter>
            <button className="btn btn-primary" onClick={()=>peticionPut()}>Editar</button>{"  "}
            <button className="btn btn-danger" onClick={()=> abrirCerrarModalEliminar}>cancelar</button>
          </ModalFooter>
      
      </Modal>

      <Modal isOpen={modalEliminar}>
        <ModalBody>
          Esta seguro que desea eliminar este dato {gestorSeleccionado && gestorSeleccionado.id}
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={()=> peticionDelete()}>
            si
          </button>
          <button className="btn btn-secondary"onClick={()=>abrirCerrarModalEliminar}>
            no
          </button>
        </ModalFooter>
      </Modal>
    
    </div>
  );
}

export default App;
