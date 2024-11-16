let array = [2,3,2,3,3,3,2,5,2,58,585,8,2,1,2];

for (var i = 0; i < array.length; i++){
    let count = 1;
    for (var j = i + 1; j < array.length; j++){
        if (array[i] === array[j]){
            count++;
            array.splice(j, 1);
            j--;
        }
    }
    if (count > 1){
        console.log(array[i] + " appears " + count + " times.");
    }
}