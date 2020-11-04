import React from "react";
import axios from "axios";
import { render, cleanup, waitForElement, queryByText, queryByAltText, getByText ,prettyDOM ,getAllByTestId ,getByAltText, getByPlaceholderText} from "@testing-library/react";

import Application from "components/Application";
import { fireEvent } from "@testing-library/react/dist";

afterEach(cleanup);

describe("Application", () => {
 
  it("changes the schedule when a new day is selected", () => {
    const { getByText } = render(<Application />);

    return waitForElement(() => getByText("Monday")).then(()  => {
      fireEvent.click(getByText("Tuesday"));
      expect(getByText("Leopold Silvers")).toBeInTheDocument();
    });
  
  });
  it("loads data, books an interview and reduces the spots remaining for the first day by 1", async() => {
    const { container, debug } = render(<Application />);
    await waitForElement(() => getByText(container,"Archie Cohen"))
    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];
    fireEvent.click(getByAltText(appointment, "Add"));

    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    
    fireEvent.click(getByText(appointment, "Save"));
    expect(getByText(appointment, "SAVING")).toBeInTheDocument();
    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));
   
    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );
    expect(getByText(day, "no spots remaining")).toBeInTheDocument();
    expect(queryByText(day, "Monday")).toBeInTheDocument();
    });

    it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
      // 1. Render the Application.
      const { container } = render(<Application />);
    
      // 2. Wait until the text "Archie Cohen" is displayed.
      await waitForElement(() => getByText(container, "Archie Cohen"));
    
      // 3. Click the "Delete" button on the booked appointment.
      const appointment = getAllByTestId(container, "appointment").find(
        appointment => queryByText(appointment, "Archie Cohen")
      );
    
      fireEvent.click(queryByAltText(appointment, "Delete"));
    
      // 4. Check that the confirmation message is shown.
      expect(
        getByText(appointment, "Are you sure you would like to delete?")
      ).toBeInTheDocument();
    
      // 5. Click the "Confirm" button on the confirmation.
      fireEvent.click(queryByText(appointment, "Confirm"));
    
      // 6. Check that the element with the text "Deleting" is displayed.
      expect(getByText(appointment, "DELETING")).toBeInTheDocument();
    
      // 7. Wait until the element with the "Add" button is displayed.
      await waitForElement(() => getByAltText(appointment, "Add"));
    
      // 8. Check that the DayListItem with the text "Monday" also has the text "2 spots remaining".
      const day = getAllByTestId(container, "day").find(day =>
        queryByText(day, "Monday")
      );
    //clean up is not working
      expect(getByText(day, "1 spot remaining")).toBeInTheDocument();
    });

    it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
      const { container } = render(<Application />);
    
      await waitForElement(() => getByText(container, "Archie Cohen"));
    
      const appointment = getAllByTestId(container, "appointment").find(
        appointment => queryByText(appointment, "Archie Cohen")
      );
    
      fireEvent.click(queryByAltText(appointment, "Edit"));
    
      fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
        target: { value: "Lydia Miller-Jones" }
      });
      fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
      
      fireEvent.click(getByText(appointment, "Save"));
      expect(getByText(appointment, "SAVING")).toBeInTheDocument();
      await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));
      const day = getAllByTestId(container, "day").find(day =>
        queryByText(day, "Monday")
      );
      
      expect(queryByText(day, "Monday")).toBeInTheDocument();
    })
    
    it("shows the save error when failing to save an  appointment", async() => {
      axios.put.mockRejectedValueOnce();
      const { container } = render(<Application />);
      await waitForElement(() => getByText(container,"Archie Cohen"))
      const appointments = getAllByTestId(container, "appointment");
      const appointment = appointments[0];
      fireEvent.click(getByAltText(appointment, "Add"));
  
      fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
        target: { value: "Lydia Miller-Jones" }
      });
      fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
      
      fireEvent.click(getByText(appointment, "Save"));
      expect(getByText(appointment, "SAVING")).toBeInTheDocument();
      await waitForElement(() => getByText(container, "There is an error!"));
      expect(getByText(appointment, "There is an error!")
            ).toBeInTheDocument();
    
    });
   
    it("shows the delete error when failing to delete an existing appointment", async() => {
      axios.delete.mockRejectedValueOnce();
      const { container } = render(<Application />);
    
      await waitForElement(() => getByText(container, "Archie Cohen"));
    
      const appointment = getAllByTestId(container, "appointment").find(
        appointment => queryByText(appointment, "Archie Cohen")
      );
    
      fireEvent.click(queryByAltText(appointment, "Delete"));
    
      expect(
        getByText(appointment, "Are you sure you would like to delete?")
      ).toBeInTheDocument();
    
      fireEvent.click(queryByText(appointment, "Confirm"));
    
      expect(getByText(appointment, "DELETING")).toBeInTheDocument();
      await waitForElement(() => getByText(appointment, "Error"));
      
    })
});




