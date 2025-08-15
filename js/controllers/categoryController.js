import {
    getCategories,
    updateCategory,
    deleteCategory,
    createCategory
} from "../services/categoryServices.js"

document.addEventListener("DOMContentLoaded", ()=>{
    //Seleccion específica
    const tableBody =  document.querySelector("#categoriesTable tbody");
    const form = document.getElementById("categoryForm");
    const modal = new bootstrap.Modal(document.getElementById("categoryModal"));
    const lbModal = document.getElementById("categoryModalLabel");
    const btnAdd = document.getElementById("btnAddCategory");

    //Despues de cargar las constantes, cragamos los registros
    loadCategories();


    //Declarando el eventon "Click" y dentro de la función flecha lo que sucede despues de dar ese click
    btnAdd.addEventListener("click", ()=>{
        form.reset();
        //Se deja vacío ya que al agregar no se necesita un Id solo al actualizar
        form.categoryId.value = "";
        lbModal.textContent = "Agregar Categoría";
        modal.show();
    });

    //e es el objeto de tipo del evento
    form.addEventListener("submit", async (e)=>{
        e.preventDefault(); //Evita que el fomrulario se envíe

        const id = form.categoryId.value;//Se obtiene el id guardado del form

        const data = {
            nombreCategoria : form.categoryName.value.trim(),
            descripcion : form.categoryDescription.value.trim()
        };

        try{
        //Si el id exite...
        if(id){
            await updateCategory(id, data)
        }
        else{
            await createCategory(data)
        }
        modal.hide
        await loadCategories();
    }
    catch(err){
        console.error("Error al guardar las categorias: ", err)
    }
    });

    async function loadCategories(){
        try{
            const data = await getCategories();
            const categories = data.content;
            tableBody.innerHTML = ''; //Vaciamos el tbody
            //Verificación si no hay categorias registradas
            if(!categories || categories.length == 0){
                tableBody.innerHTML = '<td colspan="5">Actualmente no hay registros</td>';
                //Retorno para que el codigo deje de ejecutarse
                return;
                //forEach significa que por cada bloque de elementos dentro de categorias
            }

            categories.forEach((categoria)=>{
                const tr = document.createElement("tr"); //Creamos Tr en JSON
                tr.innerHTML = `
                    <td>${categoria.idCategoria}</td>
                    <td>${categoria.nombreCategoria}</td>
                    <td>${categoria.descripcion || "Descripción no asignada"}</td>
                    <td>${categoria.fechaCreacion || ""}</td>
                    <td>
                        <button class="btn btn-sm btn-outline-secondary edit-btn">
                             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                  viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                  stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                  class="lucide lucide-square-pen">
                                  <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                  <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"/>
                             </svg>
                         </button>
 
                         <button class="btn btn-sm btn-outline-danger delete-btn">
                             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                              viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                class="lucide lucide-trash">
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>
                                <path d="M3 6h18"/>
                                <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                            </svg>
                        </button>
                    </td>
                `;

                //Funcionalidad para boton de editar categorias
                tr.querySelector(".edit-btn").addEventListener("click",()=>{
                    //Pasamos los datos del JSON a los campos dle formulario
                    form.categoryId.value = categoria.idCategoria;
                    form.categoryName.value = categoria.nombreCategoria;
                    form.categoryDescription.value - categoria.descripcion;

                    //Aqui le ponemos el título al fomrulario
                    lbModal.textCOntent = "Editar categoria";

                    modal.show();
                });

                //Funcionalidad para el botón de eliminar categorias

                tr.querySelector(".delete-btn").addEventListener("click", async ()=>{
                    //Cuadro para pedir una confirmación de SI o no
                    if(confirm("Desea elminiar la categoria?")){
                        //Simepre poner await a las funciones Asincronas. Las funciones Asincronas son las que llaman a la API
                        await deleteCategory(categoria.idCategoria);
                        await loadCategories();
                    }
                });

                //Al <tbody></tbody> le agrega el <tr></tr> creado
                tableBody.appendChild(tr);

            });
        }
        catch(err){
            console.error("Error cargando categorias", err);
        }
    }
});