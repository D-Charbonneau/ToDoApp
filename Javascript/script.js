const KEY = "Lists";
let listIndex;

window.onload = function()
{
    if(window.localStorage.getItem(KEY) != undefined)
    {
        let old = JSON.parse(window.localStorage.getItem(KEY));
    
        for(let i = 0; i < old.lists.length; i++)
        {
            listContainer.addList(old.lists[i].listName, true);
            
            for(let j = 0; j < old.lists[i].items.length; j++)
            {
                listContainer.getList(i).addItem(old.lists[i].items[j].name, old.lists[i].items[j].desc, true, old.lists[i].items[j].finished);
                listContainer.getList(i).getItem(j).finished = old.lists[i].items[j].finished;
            }
        }
    }
}
toggle = false;
let editIndex;
function edit(index)
{
    if(editIndex == undefined)
    {
        editIndex = index;
    }
    if(index == editIndex)
    {
        toggle = !toggle;
        if(toggle)
        {
            document.getElementById("p" + index).contentEditable = "true";
            document.getElementById("p" + index).style.backgroundColor = "#d0d0d0";
        }
        else
        {
            editIndex = undefined;
            document.getElementById("p" + index).contentEditable = "false";
            listContainer.getList(listIndex).getItem(index).setValues(document.getElementById("p" + index).innerText, listContainer.getList(listIndex).getItem(index).desc);
            listContainer.getList(listIndex).render();
        }
    }
}

function createList()
{
    let listInput = document.getElementById("listName");
    if(listInput.value != "")
    {
        listContainer.addList(listInput.value);
        listInput.value = "";
    }
}


function chooseList(index)
{
    
    if(listIndex == undefined)
    {
        document.getElementById("addItem").style.display = "flex";
    }
    else
    {
        document.getElementById("list" + listIndex).classList.remove("active");
    }
    listIndex = index;
    document.getElementById("list" + listIndex).classList.add("active");
    listContainer.getList(listIndex).render();
}

function addToList()
{
    let nameInput = document.getElementById("itemName");
    let descInput = document.getElementById("itemDesc");
    if(nameInput.value != "" && nameInput.value.length <= 25)
    {
        nameInput.style.color = "black";
        listContainer.getList(listIndex).addItem(nameInput.value, descInput.value);
        nameInput.value = "";
        descInput.value = "";
        listContainer.getList(listIndex).render();
    }
    else if(nameInput.value.length > 25)
    {
        nameInput.style.color = "red";
        nameInput.value = nameInput.value.substring(0, 25);
    }
}

function toggleActive(index)
{
    if(!listContainer.getList(listIndex).getItem(index).finished)
    {
        document.getElementById("i" + index).classList.remove("fa-times");
        document.getElementById("i" + index).classList.add("fa-check");
    }
    else
    {
        document.getElementById("i" + index).classList.remove("fa-check");
        document.getElementById("i" + index).classList.add("fa-times");
    }
    listContainer.getList(listIndex).getItem(index).finished = !listContainer.getList(listIndex).getItem(index).finished;
    save();
}

function Clear()
{
    listContainer.clearItems();
    save();
}

class ListContainer
{
    constructor()
    {
        this.listID = 0;
        this.lists = [];
    }

    addList(listName, loading = false)
    {
        this.lists.push(new List(listName, this.listID++));
        this.render();
        if(!loading)
        {
            save();
        }
    }

    getList(index)
    {
        return this.lists[index];
    }

    listLists()
    {
        for(let i = 0; i < this.lists.length; i++)
        {
            console.log(this.lists[i].listName);
            this.lists[i].listAllItems();
        }
    }
    render()
    {
        let nav = document.getElementById("lists");
        nav.innerHTML = "";
        for(let i = 0; i < this.lists.length; i++)
        {
            if(i == listIndex)
            {
                nav.innerHTML += `<a id="list${i}" class="active" onclick="chooseList(${i})">${this.lists[i].listName}</a>`;
            }
            else
            {
                nav.innerHTML += `<a id="list${i}" class="" onclick="chooseList(${i})">${this.lists[i].listName}</a>`;
            }
        }
        save();
    }

    clearItems()
    {
        if(listIndex != undefined)
        {
            for(let i = 0; i < this.lists.length; i++)
            {
                this.lists[i].clearFinished();
            }
            listContainer.getList(listIndex).render();
        }
    }
}

function devList()
{
    listContainer.addList("FirstList");
    listContainer.addList("SecondList");
    listContainer.addList("ThirdList");
    listContainer.getList(0).addItem("Hi there");
    listContainer.getList(0).addItem("I am in a list");
    listContainer.getList(0).addItem("You are not in a list");
    listContainer.getList(0).addItem("Final entry of list one");
    listContainer.getList(1).addItem("Hi");
    listContainer.getList(1).addItem("Ok");
    listContainer.getList(1).addItem("No");
    listContainer.getList(2).addItem("Testing");
    listContainer.getList(2).addItem("Last entry of the third list");
}


class List
{
    constructor(listName, listID)
    {
        this.listName = listName;
        this.listID = listID;
        this.itemID = 0;
        this.items = [];
    }
    
    addItem(name, desc, loading = false, finished = false)
    {
        this.items.push(new ToDoItem(name, desc, this.itemID++, finished));
        if(!loading)
        {
            save();
        }
    }

    getItem(index)
    {
        return this.items[index];
    }

    listAllItems(num = 0)
    {
        for(let i = 0; i < this.items.length; i++)
        {
            console.log("- " + this.items[i].name + "\n- - (" + this.items[i].desc + ")");
        }
    }

    clearFinished()
    {
        for(let i = this.items.length-1; i >= 0; i--)
        {
            if(this.items[i].finished)
            {
                this.items.splice(i, 1);
            }
        }
    }

    render()
    {
        let display = document.getElementById("listDisplay");
        display.innerHTML = "";
        for(let i = 0; i < this.items.length; i++)
        {
            if(this.items[i].finished)
            {
                display.innerHTML += `<div class="listItem" id="${i}"><div id="itemClass${i}" class="left"><div><i class="fa fa-check" title="Completed" id="i${i}" onclick="toggleActive(${i})"></i><p id="p${i}"><b>${this.items[i].name}</b></p></div><p class="desc" onclick="toggleDesc(${i})">${shorten(this.items[i].desc, this.items[i].name)}</p></div><div><i class="fa fa-pencil" id="i${i}" onclick="edit(${i})"></i><i class="fa fa-trash" id="i${i}" onclick="trash(${i})"></i></div></div>`;
            }
            else
            {
                display.innerHTML += `<div class="listItem" id="${i}"><div id="itemClass${i}" class="left"><div><i class="fa fa-times" title="Uncompleted" id="i${i}" onclick="toggleActive(${i})"></i><p id="p${i}"><b>${this.items[i].name}</b></p></div><p class="desc" onclick="toggleDesc(${i})">${shorten(this.items[i].desc, this.items[i].name)}</p></div><div><i class="fa fa-pencil" id="i${i}" onclick="edit(${i})"></i><i class="fa fa-trash" id="i${i}" onclick="trash(${i})"></i></div></div>`;
            }
        }
        save();
    }
}

class ToDoItem
{
    constructor(name, desc, id, finished = false)
    {
        this.id = id;
        this.name = name;
        this.desc = desc;
        this.finished = finished;
    }

    getID() 
    {
        return this.id;
    }

    setValues(name, desc)
    {
        this.name = name;
        this.desc = desc;
        save();
    }
}

function save()
{
    window.localStorage.clear(KEY);
    window.localStorage.setItem(KEY, JSON.stringify(listContainer));
}

function shorten(desc, name)
{
    if(desc.length > 30 + (25 - name.length))
    {
        return desc.substring(0, 30 + (25 - name.length)) + "...";
    }
    return desc;
}

function trash(index)
{
    listContainer.getList(listIndex).items.splice(index, 1);
    listContainer.getList(listIndex).render();
}

function hide()
{
    document.getElementById("delete").style.left = "-80px";
    document.getElementById("hideDelete").style.left = "-80px";
    setTimeout(() => 
    {
        document.getElementById("delete").style.left = "10px"; 
        document.getElementById("hideDelete").style.left = "52px";
    }, 3500);
    
}

function toggleDesc(index)
{
    if(document.getElementById("itemClass" + index).style.flexDirection == "column")
    {
        document.getElementById("itemClass" + index).style.flexDirection = "row";
        document.getElementById("itemClass" + index).style.alignItems = "center";
        document.getElementsByClassName("desc")[index].innerText = shorten(listContainer.getList(listIndex).getItem(index).desc, listContainer.getList(listIndex).getItem(index).name);
        document.getElementsByClassName("desc")[index].style.marginTop = "0px";
    }
    else
    {
        document.getElementById("itemClass" + index).style.flexDirection = "column";
        document.getElementById("itemClass" + index).style.alignItems = "flex-start";
        document.getElementsByClassName("desc")[index].innerText = listContainer.getList(listIndex).getItem(index).desc;
        document.getElementsByClassName("desc")[index].style.marginTop = "5px";
    }
}

function deleteList()
{
    listContainer.lists.splice(listIndex, 1);
    chooseList(0);
    listContainer.render();
}
function toggleDeleteModal(modalToggle)
{
    if(modalToggle)
    {
        document.getElementById("modalBG").style.pointerEvents = "auto";
        document.getElementById("modalBG").style.backgroundColor = "#0000006f";
        document.getElementById("modal").style.top = "20%";
    }
    else
    {
        document.getElementById("modalBG").style.pointerEvents = "none";
        document.getElementById("modalBG").style.backgroundColor = "#00000000";
        document.getElementById("modal").style.top = "-50%";
    }
    
    //#0000006f color of transparent modal bg
}

let listContainer = new ListContainer();