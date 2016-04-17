var
  weightedReservoirSampler= require( "weighted-reservoir-sampler")

function itemWeightProp(i){
	if(i && !isNaN( i.weight)){
		return i.weight
	}
	return i
}

function reservoirSampler( opts){
	var
	  weightFunction: o.weightFunction|| itemWeightProp,
	  n: opts.n|| 1,
	  samplerOpts= {weightFunction, sampleSize: n},
	  sampler= weightedReservoirSampler( samplerOpts),
	  push= sampler.push.bind( sampler),
	  subject= new Rx.BehaviorSubject(),
	  started= false
	opts.src.subscribe(function( x)[
		sampler.push( x)
		if(started){
			subject.next( sampler.read())
		}
	})
	opts.src.take( n).subscribe( null, null, function(){
		started= true
	})
	return subject
}

module.exports= reservoirSampler

function last( opts){
	var
	  weightFunction: o.weightFunction|| itemWeightProp,
	  n: opts.n|| 1,
	  samplerOpts= {weightFunction, sampleSize: n},
	  sampler= weightedReservoirSampler( samplerOpts),
	  push= sampler.push.bind( sampler),
	  subject= new Rx.BehaviorSubject(),
	  started= false
	opts.src.subscribe(function( x)[
		sampler.push( x)
	}, null, function(){
		subject.next(sampler.end())
	})
	return subject
}

module.exports.last= last
