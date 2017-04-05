# API for Least Cost Path for Delivery Trucks

API URL  -  https://damp-headland-61595.herokuapp.com/api/findcost/

  - Takes POST data as input  
  - Assumes
    -   input key value relations as Stock Product-Quantity
    -   either using a simulator like Postman or CURL in a Terminal
  - POST request content as x-wwww-form-urlencoded
  - Input Format is as Follows

    ```sh
    Stock Product  Quantity
    A               a
    B               b
    C               c
    D               d
    ...             ...
    ...             ...
    H               h
    I               i
    ```
    Where any Stock Product whos Quantity is 0 maybe avoided

# Sample i/o

- Input
    ```sh
    Stock Product  Quantity
    A               2
    C               3
    D               1
    G               2
    ```
 - Output :

    ```sh
    {   
        'minimum_cost' : 241
    }
    ```

If using Postman,
  - URL -  https://damp-headland-61595.herokuapp.com/api/findcost/
  - Method - POST
  - Params - Body - x-www-form-urlencoded
        -   Enter Key-Value relationships from above table

To see path as well, use the url  https://damp-headland-61595.herokuapp.com/api/costandpath with the same params.

On the terminal you could also use the following curl code

    curl -X POST -H "Content-Type: application/x-www-form-urlencoded" -H "Cache-Control: no-cache" -H "Postman-Token: 44b9acc6-98c8-b148-d200-959629443cc0" -d 'C=2&D=1&A=3&G=2' "https://damp-headland-61595.herokuapp.com/api/findcost/"

## Tech-Stack

The API was built on Node.js running the following dependancies
* express
* body-parser

And of course the code is up at [PaulSebi/tailre_task][repo] on GitHub.

tended with the following plugins. Instructions on how to use them in your own application are linked below.

### Author

Paul Sebastian
( [linkedin/PaulSebi][lin] )

### Please Note

The API and algorithm were built in a couple of hours owing to ongoing end semester examinations. Although i do understand and believe justification is not a way out, I'd like to tell you that the algorithm relies on non-optimised recursion to explore all possible paths and find the optimum one. Hence it leads to overflow of the stack memory when large quantities are attributed to the stock.
 Thank you for your time. :)


   [repo]: <https://github.com/PaulSebi/tailre_task>
   [lin]: <https://github.com/joemccann/dillinger.git>
