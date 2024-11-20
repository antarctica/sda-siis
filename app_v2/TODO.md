# Todo:
 [ ] - Measurements and routes panel. 
 [ ] - handle refreshing and resyncing layers regularly
 [ ] - delete old key value store.
 
 ## Design:
 - use coordinate formatter. 
 - use a simple text field. 
 - split into lat long input. 
 - when a user does an input validate it with the formatter. when entering one value set the other to zero. 
 - if a user pastes then check the whole thing - if its a valid lat long then split and update the values. 
 - if its not valid then clear the field. 
 - allow a user to enter value by clicking on the map. 
 - decide how/whether to allow the user to toggle the format. Use the same pattern as the browser color picker in chrome dev tools. 

 ### Spec: 
  - The input should allow a user to initiate the selection of point on the map. 
  - The input should allow a user to enter a coordinate manually. 
  - The input should allow a user to paste a coordinate. 
  - The input should show allow the user to toggle between different coordinate format.
  - The input should always store the coordinate in decimal degrees, and show the value in the format the user chooses.
  - The input should validate the users input and show an error message if the input is not a valid coordinate.
  - When a user has initiated the map input selection, then the input should be updated as the user moves the cursor over the map. The value itself should not be updated until the user confirms the selection. 
