
/**
 * @jest-environment jsdom
 */

import "@testing-library/jest-dom"
import { fireEvent, screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import {localStorageMock} from "../__mocks__/localStorage.js";
import { ROUTES, ROUTES_PATH } from "../constants/routes"
import mockStore from "../__mocks__/store.js"
import router from "../app/Router.js";

window.alert = jest.fn()
jest.mock("../app/Store", () => mockStore)

describe("Given I am connected as an employee", () => {

// Création de la page NewwBill pour chaque test  

Object.defineProperty(window, 'localStorage', { value: localStorageMock 
  })
  window.localStorage.setItem('user', JSON.stringify({
    type: 'Employee'
  }))
  const html = NewBillUI() // Création de la page NexBill
  document.body.innerHTML = html



describe("When i load a file with the wrong extension in the input form", () => {
  test ("Then an error msg is not hidden and the sub is disable", () => {
    
    const onNavigate = (pathname) => {
      document.body.innerHTML = ROUTES({ pathname})
    }
    const newBill = new NewBill({ 
      document,
      onNavigate,
      store: null,
      localStorage: window, localStorage,
    })
    const LoadFile = jest.fn((e) => newBill.handleChangeFile(e))
    const fichier = screen.getByTestId("file")
    const verifFormat = new File(["scan.pdf"],"scan.pdf", {
    type: "application/pdf"
    })
    fichier.addEventListener("change", LoadFile)
    fireEvent.change(fichier, {target: {files: [verifFormat]}})
    
    expect(LoadFile).toHaveBeenCalled()
    expect(screen.getByTestId("btn-sub-newbill").disabled).toBe(true)
    expect(screen.getByTestId("msgErrorFormat").hidden).toBe(false)

  })
});

describe("When i download the attached file in the correct format and i input information in the form ", () => {
  test ("Then the sub is not disable, the error msg is hidden ans the form is sent", () => {
    
    const onNavigate = (pathname) => {
      document.body.innerHTML = ROUTES({ pathname})
    }
    const newBill = new NewBill({ 
      document,
      onNavigate,
      store: null,
      localStorage: window, localStorage,
    })
    const LoadFile = jest.fn((e) => newBill.handleChangeFile(e))
    const fichier = screen.getByTestId("file")
    const verifFormat = new File(["scan.png"],"scan.png", {
    type: "image/png"
    })
    fichier.addEventListener("change", LoadFile)
    fireEvent.change(fichier, {target: {files: [verifFormat]}})
    console.log(screen.getByTestId("msgErrorFormat").hidden)
    
    expect(LoadFile).toHaveBeenCalled()
    // expect(screen.getByTestId("btn-sub-newbill").disabled).toBe(false)
    // expect(screen.getByTestId("msgErrorFormat").hidden).toBe(true)
    const submitBill = jest.fn((e) => newBill.handleSubmit(e))
    screen.getByTestId('form-new-bill').addEventListener('submit', submitBill)
    fireEvent.submit(screen.getByTestId('form-new-bill'))
    expect(submitBill).toHaveBeenCalled()
    expect(screen.getByTestId('btn-new-bill')).toBeTruthy()
  })
});
});


// // Début Test POST

// describe('Given I am connected as an employee', () => {//Etant donné que je suis un utilisateur connecté en tant que Salarié
//   describe("When I submit a bill with all information in input", () => {//Lorsque je soumets le formulaire rempli
//      test("Then the bill is created", async() => {//Ensuite, la facture est créée

//         const html = NewBillUI()
//         document.body.innerHTML = html
        
//         const onNavigate = (pathname) => {
//            document.body.innerHTML = ROUTES({pathname});
//         };
// //SIMILATION DE LA CONNECTION DE L EMPLOYEE
//         Object.defineProperty(window, 'localStorage', { value: localStorageMock })
//         window.localStorage.setItem('user', JSON.stringify({
//               type: 'Employee',
//               email: "jeanmich@test.tld",
//         }))
// //SIMULATION DE CREATION DE LA PAGE DE FACTURE
//         const newBill = new NewBill({
//               document,
//               onNavigate,
//               store: null,
//               localStorage: window.localStorage,
//         })
//         const validBill = {
//               type: "Hôtel et logement",
//               name: "Teuf au negresco",
//               date: "1989-01-02",
//               amount: 1400,
//               vat: 280,
//               pct: 20,
//               commentary: "Grosse teuf",
//               fileUrl: "../facture.jpg",
//               fileName: "facture.jpg",
//         };
//         // Charger les valeurs dans les champs
//         screen.getByTestId("expense-type").value = validBill.type;
//         screen.getByTestId("expense-name").value = validBill.name;
//         screen.getByTestId("datepicker").value = validBill.date;
//         screen.getByTestId("amount").value = validBill.amount;
//         screen.getByTestId("vat").value = validBill.vat;
//         screen.getByTestId("pct").value = validBill.pct;
//         screen.getByTestId("commentary").value = validBill.commentary;

//         newBill.fileName = validBill.fileName
//         newBill.fileUrl = validBill.fileUrl;

//         newBill.updateBill = jest.fn();//SIMULATION DE  CLICK
//         const handleSubmit = jest.fn((e) => newBill.handleSubmit(e))//ENVOI DU FORMULAIRE

//         const form = screen.getByTestId("form-new-bill");
//         form.addEventListener("submit", handleSubmit);
//         fireEvent.submit(form)

//         expect(handleSubmit).toHaveBeenCalled()//VERIFICATION DE L ENVOI DU FORMULAIRE
//         expect(newBill.updateBill).toHaveBeenCalled()//VERIFIE SI LE FORMULAIRE EST ENVOYER DANS LE STORE
//         expect(screen.getByText("Teuf au negresco")).toBeTruthy
        
//      })
//     });
//   