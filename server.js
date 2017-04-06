var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

var port = process.env.PORT || 8090;
var router = express.Router();

router.use(function(req, res, next){
  console.log('Event');
  next();
});

router.get('/', function(req, res){
  res.json({message:'Up and Running!'});
});

router.route('/findcost')
  .post(function(req, res){
      var val = initValues();
                                                      //init stock values
      valtab[0][0][2] = req.body.A!=null ? parseInt(req.body.A) : 0;
      valtab[0][1][2] = req.body.B!=null ? parseInt(req.body.B) : 0;
      valtab[0][2][2] = req.body.C!=null ? parseInt(req.body.C) : 0;
      valtab[1][0][2] = req.body.D!=null ? parseInt(req.body.D) : 0;
      valtab[1][1][2] = req.body.E!=null ? parseInt(req.body.E) : 0;
      valtab[1][2][2] = req.body.F!=null ? parseInt(req.body.F) : 0;
      valtab[2][0][2] = req.body.G!=null ? parseInt(req.body.G) : 0;
      valtab[2][1][2] = req.body.H!=null ? parseInt(req.body.H) : 0;
      valtab[2][2][2] = req.body.I!=null ? parseInt(req.body.I) : 0;

      for(i=0; i<3; i++)
        for(j=0; j<3; j++)
            totalItems+=valtab[i][j][2];
      n = totalItems;

      for(i=3; i>0; i--)
        calcLeast(i, 0, 0, 0, 0, ' ');
      res.json({minimum_cost: leastCost});

  });

  router.route('/costandpath')
    .post(function(req, res){
        var val = initValues();
                                                            //init stock values
        valtab[0][0][2] = req.body.A!=null ? parseInt(req.body.A) : 0;
        valtab[0][1][2] = req.body.B!=null ? parseInt(req.body.B) : 0;
        valtab[0][2][2] = req.body.C!=null ? parseInt(req.body.C) : 0;
        valtab[1][0][2] = req.body.D!=null ? parseInt(req.body.D) : 0;
        valtab[1][1][2] = req.body.E!=null ? parseInt(req.body.E) : 0;
        valtab[1][2][2] = req.body.F!=null ? parseInt(req.body.F) : 0;
        valtab[2][0][2] = req.body.G!=null ? parseInt(req.body.G) : 0;
        valtab[2][1][2] = req.body.H!=null ? parseInt(req.body.H) : 0;
        valtab[2][2][2] = req.body.I!=null ? parseInt(req.body.I) : 0;

        for(i=0; i<3; i++)
          for(j=0; j<3; j++)
              totalItems+=valtab[i][j][2];
        n = totalItems;

        for(i=3; i>0; i--)
          calcLeast(i, 0, 0, 0, 0, ' ');
        res.json({minimum_cost: leastCost, best_path: bestpath});

    });


var valtab, distab,  bestpath;
var leastCost, totalItems, n;

var initValues = function(){
    valtab = [                                    //detail Center-Stock-Weight table
              [['A', 3], ['B', 2], ['C', 8]],
              [['D', 12],['E', 25],['F',15]],
              [['G', .5],['H', 1], ['I', 2]]
                                            ];
    distab = [                                      //     L1   C1  C2  C3 detail all routes
              [0,   3,  2.5, 2],                    //  L1  0   3  2.5  2
              [3,   0,  4,   0],                    //  C1  3   0   4   0
              [2.5, 4,  0,   3],                    //  C2 2.5  4   0   3
              [2,   0,  3,   0]                     //  C3  2   0   3   0
                                ];
    leastCost = 999;                                //so that first value is assumed to be leastCost
    totalItems = 0;    
    bestpath = "";

    return valtab;
};

var calcLeast = function(starttruck, count, dist, weight, totalcost, path){
    var i, p, q, r, tpath = '';
    var cost;
    cost = weight < 5 ? 10 * dist : (10 + Math.ceil((weight-5)/5)*8) * dist;
                                          //calculate cost according to given formula
    if(count == totalItems){
        cost = cost + totalcost;          //add cost of travelling to that location in each step

        if(cost < leastCost){             //print leastCost and path when it is obtained
            leastCost = cost;
            bestpath = path + ' L';
          }
        return;
    }
    else if(n==0)
      return;

    for(i=0; i<4; i++){               //for looping distab
        if(distab[starttruck][i]!=0)  //check if route is available
        {
              if(starttruck==0)       //if location and total items not arrived, trace back to another source
              {
                    calcLeast(i, count + 0, distab[starttruck][i], weight * 0, totalcost + cost, path + 'L - '); //weight = 0 signifies return trip without any items
              }

              else if(valtab[starttruck-1][0][2]==0 && valtab[starttruck-1][1][2]==0 && valtab[starttruck-1][2][2]==0)
                    return;           //if no values remaining in source, return and proceed to next source

              else                                                 //from each center, visit next node using every permutation of Stock
              {
                  for(p=0; p<=valtab[starttruck-1][0][2]; p++)     //permutations of quantities of A/B/C
                    for(q=0; q<=valtab[starttruck-1][1][2]; q++)   //DEF
                        for(r=0; r<=valtab[starttruck-1][2][2]; r++)  //GHI
                        {
                            if( p == 0 && q == 0 && r == 0)        //no further check required
                              continue;

                            valtab[starttruck-1][0][2] -= p;
                            valtab[starttruck-1][1][2] -= q;
                            valtab[starttruck-1][2][2] -= r;      //subtract from table each Quantity pf respective stock in truck
                            n -= (p+q+r);                         //for total number of items check

                            tpath += p? valtab[starttruck-1][0][0]:'';
                            tpath += q? valtab[starttruck-1][1][0]:'';
                            tpath += r? valtab[starttruck-1][2][0]:'';

                            calcLeast(i, count + p+q+r, distab[starttruck][i], weight + valtab[starttruck-1][0][1]*p + valtab[starttruck-1][1][1]*q + valtab[starttruck-1][2][1]*r, totalcost + cost, path + tpath + ' - ');
                                                                  //recursive call to simulate truck reaching next location
                            tpath = '';

                            n += (p+q+r);                         //reset values of n, temporary path, and table for next iteration
                            valtab[starttruck-1][0][2] += p;
                            valtab[starttruck-1][1][2] += q;
                            valtab[starttruck-1][2][2] += r;
                        }
              }
        }
    }

    return;
}

app.use('/api', router);
app.listen(port,function(){
    console.log('Listening to '+port);
});
