<template>
  <div id="wrapper">
    <div class="header">
      <img src="../../icons/128x128.png" alt="" width="32">
      <h3>随便写点儿什么~</h3>
      <el-input size="mini" class="searchInput" v-model="searchInput" clearable>
        <el-button class="searchBtn" slot="append" icon="el-icon-search" @click="search"></el-button>
      </el-input>
    </div>
      <el-row :gutter="10">
        <el-col :span="12">
          <p v-if="this.noteList.length === 0" class="no-note">暂无记录</p>
          <ul class="titleList">
            <li v-for="(item,index) in noteList" :key="item._id" @click="noteClick(item._id,index)" :class="{'activeItem':ind===index}">
              <i class="el-icon-circle-close-outline" @click.stop="deleteNote(item._id)"></i>
              <p class="note-date">{{item.date}}</p>
              <p class="note-content">{{item.content}}</p>
            </li>
          </ul>
        </el-col>
        <el-col :span="12">
          <el-input type="textarea" v-model="content" :autosize="{ minRows:8, maxRows: 16}"></el-input>
          <el-button type="warning" size="small" class="reset-btn" @click="reset">重置</el-button>
          <el-button type="primary" size="small" class="save-btn" @click="save">保存</el-button>
        </el-col>
      </el-row>
  </div>
</template>

<script>
  const Datastore = require('nedb');
  const db = new Datastore({filename: './data/note.db'});

  export default {
    data() {
      return{
        noteList: [],
        content: '',
        editId: '',
        ind: '',
        searchInput: '',
      }
    },
    created() {
      db.loadDatabase();
      this.refresh();
    },
    watch: {
      searchInput() {
        if(!this.searchInput) {
          this.refresh();
        }
      }
    },
    methods: {
      insert() {
        db.insert({
          name: 'test'
        }, (err, ret) => {
          if(err) console.log(err);
          this.refresh();
        });
      },
      refresh() {
        db.find({}).sort({date: -1}).exec((err, data) => {
          if(err) console.log(err);
          this.noteList = data;
        })
      },
      save() {
        if(this.editId){
          db.update({_id:this.editId},{$set: {content:this.content}},()=>{
            this.refresh();
          })
        } else {
          db.insert({
            content: this.content,
            date: new Date().toLocaleString()
          }, (err, ret) => {
            if(err) console.log(err);
            this.refresh();
            this.reset();
          });
        } 
      },
      noteClick(id,index){
        this.ind = index;
        this.editId = id;
        db.find({_id:id},(err, data) => {
          if(err) console.log(err);
          console.log(data)
          this.content = data[0].content;
        })
      },
      deleteNote(id){
        db.remove({_id:id},()=>{
          this.refresh();
        })
      },
      reset() {
        this.content = '';
        this.editId = '';
        this.ind = '';
      },
      search() {
        let reg = new RegExp(`${this.searchInput}`);
        db.find({ content: {$regex: reg}}).sort({date: -1}).exec((err,data)=>{
          console.log(data)
          this.noteList = data;
        })
      },
    }
  }
</script>

<style lang="scss" scoped>
  #wrapper{
    padding: 15px;
    .header{
      display: flex;
      align-items: center;
      h3{
        margin: 15px 10px;
      }
      .searchInput{
        width: 220px;
        .searchBtn{
          padding: 12px 13px; 
        }
      }
    }
    .no-note{
      text-align: center;
      font-size: 12px;
      margin-top: 15px;
      color: #555;
    }
    .titleList{
      list-style: none;
      height: 400px;
      overflow-y: hidden;
      li{
        position: relative;
        padding: 10px 5px;
        border-radius: 3px;
        cursor: pointer;
        .note-date{
          font-size: 12px;
        }
        .note-content{
          width: 80%;
          font-size: 14px;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
          overflow: hidden;
          text-overflow: ellipsis; 
        }
        .el-icon-circle-close-outline{
          position: absolute;
          right: 5px;
          color: red;
          display: none;
        }
        &:hover{
          background-color: rgba(102,177,255,.3);
          & .el-icon-circle-close-outline {
            display: block;
          }
        }
        &.activeItem {
          background-color: rgba(102,177,255,.3);
        }
      }
      &:hover{
        overflow-y: scroll;
      }
    }
    .save-btn{
      margin-top: 5px;
      float: right;
    }
    .reset-btn{
      margin-top: 5px;
      margin-left: 5px;
      float: right;
    }
  }
</style>
