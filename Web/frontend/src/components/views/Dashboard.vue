<template>
    <b-container fluid>
      <b-row>
        <b-col lg="3" sm="6">
          <b-card class="card-stats">
            <b-card-body>
              <b-row>
                <b-col cols="5">
                  <div class="icon-big text-center icon-warning">
                    <i class="nc-icon nc-chart text-warning"></i>
                  </div>
                </b-col>
                <b-col cols="7">
                  <div class="numbers">
                    <p class="card-category">Number</p>
                    <b-card-title tag="h4">150GB</b-card-title>
                  </div>
                </b-col>
              </b-row>
            </b-card-body>
            <b-card-footer>
              <hr />
              <div class="stats">
                <i class="fas fa-redo mr-1"></i>
                Update Now
              </div>
            </b-card-footer>
          </b-card>
        </b-col>
        <!-- 其他卡片內容... -->
      </b-row>
      <!-- 其他行內容... -->
    </b-container>
  </template>
  
  <script>
  import { Badge,
  Button,
  Card,
  Navbar,
  Nav,
  Table,
  Container,
  Row,
  Col,
  Form,
  OverlayTrigger,
  Tooltip } from 'bootstrap-vue';
  
  export default {
    name: 'Dashboard',
    components: {
      BContainer,
      BRow,
      BCol,
      BCard,
    },
  };
  </script>
  
  <style scoped>
  /* Your styles here */
  </style>
  