const miAlerta = {
    props: {
        titulo: String
    },
    template:`
<div class="modal" tabindex="-1" role="dialog" style="display: block; padding-right: 17px;">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">{{titulo}}</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="cancelado">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <p><slot></slot></p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-primary" @click="entendido">Ok</button>
        <button type="button" class="btn btn-secondary" data-dismiss="modal" @click="cancelado">Cancel</button>
      </div>
    </div>
  </div>
</div>`,
    methods: {
        entendido: function () {
            this.$emit('miOk');
        },
        cancelado: function () {
            this.$emit('cancelado');
        }
    }
}

const miTablaEstudiantes = {
    data: function () {
        return {
            estudiantes: [],
            alertaRegistro: false,
            alertaCurso: false,
            matricula:0,
            curso:''
        }
    },
    methods: {
      confirmarBorradoRegistro: function (m) {
          this.matricula = m;
          this.alertaRegistro = true;
      },
      confirmarBorradoCurso: function (c) {
            this.curso = c;
            this.alertaCurso = true;
        }
    },
    components: {
        dialogAlerta: miAlerta
    },
    template: `
<div>
    <h4 style="text-align: center">
        <slot></slot>
    </h4>
    <div class="panel panel-default ">
        <dialog-alerta v-if="alertaRegistro" @ok="alertaRegistro=false" @cancelado="alertaRegistro=false" titulo="Atención">
            ¿Estás seguro que quieres borrar el registro con matrícula {{matricula}}?
        </dialog-alerta>
        <dialog-alerta v-if="alertaCurso" @ok="alertaCurso=false" @cancelado="alertaCurso=false" titulo="Atención">
            ¿Estás seguro que quieres quitarle el curso {{curso}}?
        </dialog-alerta>
        <table class="table table-striped table-bordered "> 
            <thead> 
                <tr> 
                    <th style="text-align: center">Matricula</th> 
                    <th style="text-align: center">Nombre</th> 
                    <th style="text-align: center">Cursos</th> 
                    <th style="text-align: center">
                        <button type="button" class="btn btn-primary btn-default btn-sm" title="Nuevo Alumno">
                              <span class="glyphicon glyphicon-plus" aria-hidden="false">
                              </span>
                        </button>
                    </th>
                 </tr> 
            </thead> 
            <tbody> 
                <tr v-for="e in estudiantes"> 
                    <td style="text-align: center">{{e.matricula}}</td> 
                    <td style="text-align: center">{{e.nombre}}</td>
                    <td> 
                        <div style="text-align: end; vertical-align: middle; "> 
                            <button type="button" class="btn btn-info btn-default btn-sm" title="Inscribir en un curso">
                              <span class="glyphicon glyphicon-plus" aria-hidden="false">
                              </span>
                            </button>
                        </div> 
                        <p style="text-align: end" v-for="c in e.cursosNombre"> 
                            {{c}} 
                            <button type="button" class="btn btn-default btn-sm" 
                                        :title="'Dar de baja en el curso: '+c" @click="confirmarBorradoCurso(c)">
                                <span class="glyphicon glyphicon-remove" aria-hidden="false"></span>
                            </button>
                        </p>
                    
                    </td> 
                    <td>    
                        <div style="text-align: center; ">                              
                            <button type="button" class="btn btn-danger btn-default btn-sm" 
                                    :title="'Eliminar registro de matricula '+e.matricula" @click="confirmarBorradoRegistro(e.matricula)">
                              <span class="glyphicon glyphicon-remove" aria-hidden="false">
                              </span>
                            </button>
                        </div>
                    </td>
                </tr> 
            </tbody> 
        </table>
    </div>
</div>`,
    mounted: function () {
        let resultados = null;
        fetch('http://localhost:4000/estudiantes',{
            method:'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).
        then(response => {
            return response.json();
        }).
        then(datos =>{
            datos.forEach(e => {
                if(!e.cursosNombre)
                    e.cursosNombre = [];
                e.cursos.forEach(c => {
                    fetch(c,{
                        method:'GET',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }).
                    then(respCurso => {
                        return respCurso.json();
                    }).
                    then(datoCurso =>{
                        e.cursosNombre.push(datoCurso.nombre);
                    }).
                    catch(error => {
                        console.log(error);
                    });
                })
            })
            this.estudiantes = datos;
        }).
        catch(error => {
            console.log(error);
        });
    }
}

const app = new Vue({
    el:'#miApp',
    data: {
      alerta: false
    },
    components: {
        miTablaEstudiantes: miTablaEstudiantes,
        miAlerta: miAlerta
    }
});