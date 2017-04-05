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
      valtab_orig = valtab.slice(); //save a copy

      for(i=3; i>0; i--)
        calcLeast(i, 0, 0, 0, 0, ' ');
      res.json({minimum_cost: leastCost, best_path: bestpath});

  });

var valtab, distab, valtab_orig, bestpath;
var leastCost = 999, totalItems = 0, n;

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
    leastCost = 999;
    totalItems = 0;
    bestpath = "";

    return valtab;
};

var calcLeast = function(starttruck, count, dist, weight, totalcost, path){
    var i, p, q, r, tpath = '';
    var cost;
    cost = weight < 5 ? 10 * dist : (10 + Math.ceil((weight-5)/5)*8) * dist;

    if(count == totalItems){
        cost = cost + totalcost;

        if(cost < leastCost){
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
                    calcLeast(i, count + 0, distab[starttruck][i], weight * 0, totalcost + cost, path + 'L - '); //add 5 to weight to simulate return trip without any items
              }

              else if(valtab[starttruck-1][0][2]==0 && valtab[starttruck-1][1][2]==0 && valtab[starttruck-1][2][2]==0)
                    return;           //if no values remaining in source, return and proceed to next source

              else                                                 //from each center, visit next node using every permutation of Stock
              {
                  for(p=0; p<=valtab[starttruck-1][0][2]; p++)
                    for(q=0; q<=valtab[starttruck-1][1][2]; q++)
                        for(r=0; r<=valtab[starttruck-1][2][2]; r++)
                        {
                            if( p == 0 && q == 0 && r == 0)
                              continue;

                            valtab[starttruck-1][0][2] -= p;
                            valtab[starttruck-1][1][2] -= q;
                            valtab[starttruck-1][2][2] -= r;
                            n -= (p+q+r);

                            tpath += p? valtab[starttruck-1][0][0]:'';
                            tpath += q? valtab[starttruck-1][1][0]:'';
                            tpath += r? valtab[starttruck-1][2][0]:'';

                            calcLeast(i, count + p+q+r, distab[starttruck][i], weight + valtab[starttruck-1][0][1]*p + valtab[starttruck-1][1][1]*q + valtab[starttruck-1][2][1]*r, totalcost + cost, path + tpath + ' - ');

                            tpath = '';
                            n += (p+q+r);

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
